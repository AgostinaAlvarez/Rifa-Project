import { modelOptions, prop, Ref, Severity } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { Plans } from '../plans/plans.model';
import { User } from '../users/users.model';

@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    timestamps: true,
    toObject: {
      getters: true,
      virtuals: false,
    },
  },
})
export class Payments {
  _id: ObjectId;

  @prop({ required: true })
  externallId: string;

  @prop()
  paymentDate: Date;

  @prop()
  subscriptionId: string;

  @prop()
  amount: number;

  @prop({
    ref: () => User,
  })
  user: Ref<User, string>;

  @prop({
    ref: () => Plans,
  })
  plan: Ref<Plans, string>;
}
