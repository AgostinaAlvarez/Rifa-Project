import { modelOptions, prop, Ref, Severity } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { Plans } from '../plans/plans.model';
import { Role } from '../utils/enums/role.enum';
import { PaymentStatus } from '../utils/enums/paymentStatus.enum';

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
export class User {
  _id: ObjectId;

  @prop({ enum: Role, type: () => [String] })
  roles: Role[];

  @prop()
  fullName?: string;

  @prop({ required: true, unique: true })
  email: string;

  @prop()
  birthday?: Date;

  @prop()
  phone?: number;

  @prop()
  identificationFull?: string;

  @prop({ default: false })
  isActive?: boolean;

  @prop()
  tokenEmailVerificationCreatedAt?: Date;

  @prop()
  tokenEmailVerification?: string;

  @prop()
  emailVerificationAt?: Date;

  @prop({ default: false })
  isBlocked?: boolean;

  @prop({ default: false })
  isFinishedSuscription?: boolean;

  @prop()
  finishedSuscriptionAt?: Date;

  @prop()
  deletedAt?: Date;

  @prop({
    ref: () => Plans,
  })
  plan?: Ref<Plans, string>;

  @prop()
  password?: string;

  @prop()
  tokenEmailRecovery?: string;

  @prop()
  tokenEmailRecoveryCreatedAt?: Date;

  @prop({ enum: PaymentStatus, type: () => String })
  paymentStatus?: PaymentStatus;

  @prop()
  subscriptionId?: string;

  @prop()
  updatedStatusSubscriptionAt?: Date;

  @prop()
  profileImageUrl?: string;

  createdAt?: Date;
}
