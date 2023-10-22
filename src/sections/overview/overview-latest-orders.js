import {format} from 'date-fns';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import {Scrollbar} from 'src/components/scrollbar';
import {SeverityPill} from 'src/components/severity-pill';
import moment from "moment";
import {formatOrderStatus} from "../../utils";
import {useRouter} from "next/router";

const statusMap = {
  "CREATED" : 'primary',
  "DELIVERING": 'warning',
  "COMPLETED": 'success',
  "CANCELLED": 'error'
};


export const OverviewLatestOrders = (props) => {
  const router = useRouter();
  const {orders = [], sx} = props;
  return (
    <Card sx={sx}>
      <CardHeader title="Latest Orders"/>
      <Scrollbar sx={{flexGrow: 1}}>
        <Box sx={{minWidth: 800}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Order
                </TableCell>
                <TableCell>
                  User
                </TableCell>
                <TableCell sortDirection="desc">
                  Date
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                const createdAt = moment(order.createdAt).format('DD/MM/YYYY');

                return (
                  <TableRow
                    hover
                    key={order.id}
                  >
                    <TableCell>
                      {order.id}
                    </TableCell>
                    <TableCell>
                      {order.user.name}
                    </TableCell>
                    <TableCell>
                      {createdAt}
                    </TableCell>
                    <TableCell>
                      <SeverityPill color={statusMap[formatOrderStatus(order.status)]}>
                        {formatOrderStatus(order.status)}
                      </SeverityPill>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <Divider/>
      <CardActions sx={{justifyContent: 'flex-end'}}>
        <Button
          color="inherit"
          endIcon={(
            <SvgIcon fontSize="small">
              <ArrowRightIcon/>
            </SvgIcon>
          )}
          size="small"
          variant="text"
          onClick={() => router.push('/order')}
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
};

OverviewLatestOrders.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object
};
