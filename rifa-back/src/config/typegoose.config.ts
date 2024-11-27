import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

export const TypegooseConfig = (
  config: ConfigService,
): TypegooseModuleOptions => ({
  uri: config.get('MONGO_URL'),
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
