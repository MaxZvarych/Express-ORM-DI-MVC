import { Payment } from '@entity/payment';
import { User } from '@entity/user';

export interface IUser {
    email: string,
    paymentIDs?: string[], 
    firstName: string, 
    lastName: string, 
    type: "admin" | "user", 
    phoneNumber: string, 
    location: string 
  }

export const getAllUser = async () => {
  try {
    return await User.find({ relations: ['payments'] });
  } catch (e) {
    console.error(e);
  }
}

export const applyPaymentsToUser = async (userID: string, paymentIDs?:string[]) => {
  try {
    const user= await User.findOne({
      where: { id: userID },
    });
    if(paymentIDs){
    await Promise.all(paymentIDs.map(async (_paymentID) => {
      const payment = await Payment.findOne({
        where: {id:_paymentID}
      });
      payment!.user=user;
      await payment?.save();
    }
    ));}
    return user;

  } catch (e) {
    console.error(e);
  }
}

// READ SERVICE
export const getUser = async (userID?: string) => {
  try {
    if (userID) {   // get specific user
      return await User.findOne({
        where: { id: userID },
      });
    } else {        // get all users
      return await User.find({ relations: ['payments'] });
    }
  } catch (e) {
    console.error(e);
  }
}

export const createUser = async ({ email, paymentIDs, firstName, lastName, type, phoneNumber, location }: 
  IUser) => {
  try {
    const _newUser = new User();
    _newUser['email'] = email;
    _newUser['firstName'] = firstName;
    _newUser['lastName'] = lastName;
    _newUser['type'] = type;
    _newUser['phoneNumber'] = phoneNumber;
    _newUser['location'] = location;
    await _newUser.save();

    applyPaymentsToUser(_newUser.id,paymentIDs);

    return await User.findOne({
      where: { email: email },
      relations: ['payments']
    });

  } catch (e) {
    console.error(e);
  }
}

export const updateUser = async ({ id, email, paymentIDs, firstName, lastName, type, phoneNumber, location }: { id: string } & IUser) => {
  try {
    const _updatedUser = await User.findOne({ where: { id }, relations: ['payments'] });
    if (!_updatedUser) return { message: "User is not found!" };
    _updatedUser['email'] = email;
    _updatedUser['firstName'] = firstName;
    _updatedUser['lastName'] = lastName;
    _updatedUser['type'] = type;
    _updatedUser['phoneNumber'] = phoneNumber;
    _updatedUser['location'] = location;
    await Promise.all(_updatedUser['payments']?.map(async (_payment) => {
      try {
        return _payment.remove();
      } catch (e) {
        console.error(e);
      }
    }));
    await _updatedUser.save();
    applyPaymentsToUser(_updatedUser.id,paymentIDs);

    return await User.findOne({
      where: { email: email },
      relations: ['payments']
    });

  } catch (e) {
    console.error(e);
  }
}

export const deleteUser = async ({ id }: { id: string }) => {
  try {
    const foundUser = await User.findOne({ id: id });
    return await foundUser?.remove();
  } catch (e) {
    console.error(e);
  }
}