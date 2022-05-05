import { Payment } from '@entity/payment';
import { User } from '@entity/user';

export interface IPayment {
    cardNumber: string,
    userID?: string, 
    cvv: string, 
    placeHolderName: string, 
    receiver: string, 
    expirationDate: string, 
  }

export const getAllPayments = async () => {
  try {
    return await Payment.find({ relations: ['user'] });
  } catch (e) {
    console.error(e);
  }
}

export const applyUserToPayment = async ( paymentID:string, userID?: string) => {
  try {
    const payment= await Payment.findOne({
      where: { id: paymentID },
    });
    if(userID){
      const user = await User.findOne({
        where: {id:userID}
      });
      payment!.user=user;
      await payment?.save();
    }
    return payment;

  } catch (e) {
    console.error(e);
  }
}

// READ SERVICE
export const getPayment = async (paymentID?: string) => {
  try {
    if (paymentID) {   // get specific payment
      return await Payment.findOne({
        where: { id: paymentID },
      });
    } else {        // get all payments
      return await Payment.find({ relations: ['user'] });
    }
  } catch (e) {
    console.error(e);
  }
}

export const createPayment = async ({ cardNumber,userID, cvv, placeHolderName, receiver, expirationDate,  }: 
  IPayment) => {
  try {
    const _newPayment = new Payment();
    _newPayment['cardNumber'] = cardNumber;
    _newPayment['cvv'] = cvv;
    _newPayment['placeHolderName'] = placeHolderName;
    _newPayment['receiver'] = receiver;
    _newPayment['expirationDate'] = expirationDate;
    await _newPayment.save();

    applyUserToPayment(_newPayment.id,userID);

    return await Payment.findOne({
      where: { cardNumber: cardNumber },
      relations: ['user']
    });

  } catch (e) {
    console.error(e);
  }
}

export const updatePayment = async ({ id, cardNumber, userID, cvv, placeHolderName, receiver, expirationDate }: { id: string } & IPayment) => {
  try {
    const _updatedPayment = await Payment.findOne({ where: { id }, relations: ['user'] });
    if (!_updatedPayment) return { message: "Payment is not found!" };
    _updatedPayment['cardNumber'] = cardNumber;
    _updatedPayment['cvv'] = cvv;
    _updatedPayment['placeHolderName'] = placeHolderName;
    _updatedPayment['receiver'] = receiver;
    _updatedPayment['expirationDate'] = expirationDate;
    await _updatedPayment.save();
    // applyUserToPayment(_updatedPayment.id,userID);

    return await Payment.findOne({
      where: { cardNumber: cardNumber },
      relations: ['user']
    });

  } catch (e) {
    console.error(e);
  }
}

export const deletePayment = async ({ id }: { id: string }) => {
  try {
    const foundPayment = await Payment.findOne({ id: id });
    return await foundPayment?.remove();
  } catch (e) {
    console.error(e);
  }
}

export const buyCourse = async ( courseID:string,paymentID?: string) => {
    try {
        console.log(courseID)
      if (paymentID) {   // get specific payment
        return await Payment.findOne({
          where: { id: paymentID },
        });
      } else {        // get all payments
        return Error("That course or payment wasn't found")
      }
    } catch (e) {
      console.error(e);
    }
  }