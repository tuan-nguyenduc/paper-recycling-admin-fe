import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import { TOKEN_KEY } from '../constants';
import paperRecyclingApis from '../services/paperRecyclingApis';

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
            isAuthenticated: true,
            isLoading: false,
            user
          })
          : ({
            isLoading: false,
            isAuthenticated: false
          })
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;

    try {
      isAuthenticated = !!window.sessionStorage.getItem(TOKEN_KEY);
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {
      try {
        const userResp = await paperRecyclingApis.me();
        const user = userResp.data;

        dispatch({
          type: HANDLERS.INITIALIZE,
          payload: {
            ...user,
            avatar: user.avatar || '/assets/avatars/avatar-anika-visser.png'
          }
        });
      } catch (err) {
        console.log('fetching user info failed: ', err);
        dispatch({
          type: HANDLERS.INITIALIZE
        });
      }
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const signIn = async (email, password) => {
    if (!email || !password) {
      throw new Error('Please check your email and password');
    }
    const loginResp = await paperRecyclingApis.login({ email, password });
    const accessToken = loginResp.data.accessToken;
    console.log('in auth-context signIn(): ', accessToken);
    try {
      window.sessionStorage.setItem(TOKEN_KEY, accessToken);
    } catch (err) {
      console.error(err);
    }

    try {
      const userResp = await paperRecyclingApis.me();
      const user = userResp.data;
      if (user.role !== 'ADMIN') {
        throw new Error('You are not authorized to access this page');
      }

      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: {
          ...user,
          avatar: user.avatar || '/assets/avatars/avatar-anika-visser.png'
        }
      });
    } catch (err) {
      console.log('fetching user error: ', err);
    }
  };

  const signUp = async (email, name, password) => {
    throw new Error('Sign up is not implemented');
  };

  const signOut = () => {
    window.sessionStorage.removeItem(TOKEN_KEY);
    dispatch({
      type: HANDLERS.SIGN_OUT
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
