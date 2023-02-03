import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Container, Stack } from "@mui/system";
import React, { useEffect, useState } from "react";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import CollapsibleTable from "./OrderTable";
import { useMenu } from "../context/MenuContext";
import { getFirebase } from "../utils/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

const OrderCard = (props) => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = async (order) => {
    const { firestore } = getFirebase();
    const docRef = doc(firestore, "orders", order.id);
    const updatedOrder = order;
    updatedOrder.payment_status = "paid";
    delete updatedOrder.id;
    setOpen(false);
    await updateDoc(docRef, updatedOrder);
    console.log(order);
  };
  const { order } = props;

  function checkAvail(order) {
    const orderObj = order;
    const { menuList } = useMenu();

    for (let stall_order in orderObj.stall_order) {
      for (let itemId in orderObj.stall_order[stall_order].items_ordered) {
        if (menuList[stall_order][itemId].availability == false) {
          return false;
        }
      }
    }
    return true;
  }
  const [cardSX, setCardSX] = useState({
    bgcolor: "primary.main",
    color: "common.white",
    textOverflow: "ellipsis",
  });
  useEffect(() => {
    if (order.payment_status === "unpaid") {
      setCardSX({
        bgcolor: "primary.main",
        color: "common.white",
        textOverflow: "ellipsis",
      });
    }

    if (order.payment_status === "paid") {
      setCardSX({
        bgcolor: "secondary.main",
        color: "common.white",
        textOverflow: "ellipsis",
      });
    }

    return () => {};
  }, [order]);

  return (
    <Card sx={{ minWidth: 275 }} variant="outlined">
      <CardHeader
        sx={cardSX}
        title={
          <Stack justifyContent="flex-start" alignItems="flex-start">
            <Container maxWidth={false} disableGutters>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Button color="inherit">#{order.order_id}</Button>
                <Button color="inherit" startIcon={<MoneyOffIcon />}>
                  {order.payment_status}
                </Button>
              </Stack>
            </Container>

            <Typography variant="body2">{order.user_info.name}</Typography>
            <Typography variant="caption">{order.user_info.email}</Typography>
          </Stack>
        }
      />
      <CardContent sx={{ p: 0 }}>
        <CollapsibleTable rows={order} />
      </CardContent>
      <CardActions>
        <Button
          disabled={!checkAvail(order) || order.payment_status !== "unpaid"}
          onClick={handleClickOpen}
          variant="contained"
          color="secondary"
        >
          Confirm Payment
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirm payment?</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {!checkAvail(order) ? (
                <Typography color="error">
                  Some Items in the Order Have Gone Out of Stock
                </Typography>
              ) : (
                ""
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button
              onClick={() => {
                handleSubmit(order);
              }}
              autoFocus
              disabled={!checkAvail(order)}
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </CardActions>
    </Card>
  );
};

export default OrderCard;
