import { Injectable } from '@nestjs/common';
import { Schema, isValidObjectId } from 'mongoose';
import * as moment from 'moment';
import * as randomNumber from 'random-number';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { GeneralResponse } from '@/shared/entities/general-response';
import {
  DEVELOPMENT_ENV,
  PRODUCTION_ENV,
  STAGING_ENV,
  TEST_ENV,
} from '@/shared/configs/constants';
import { GetTimeParams } from './types/get-time-params.interface';

@Injectable()
export class UtilsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly i18nService: I18nService,
  ) {}

  isValidObjectId(stringId: string): boolean {
    return isValidObjectId(stringId);
  }

  toObjectId(stringId: string): Schema.Types.ObjectId {
    return new Schema.Types.ObjectId(stringId);
  }

  getGeneralResponse(value: boolean): GeneralResponse {
    return {
      result: value,
    };
  }

  async getSalt(): Promise<string> {
    return bcrypt.genSalt();
  }

  async bcrypeHash(value: string): Promise<string> {
    const salt = await this.getSalt();

    return bcrypt.hash(value, salt);
  }

  async compareBcrypeHash(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }

  encryptValue(value: string, salt: string) {
    return scryptSync(value, salt, 32).toString('hex');
  }

  /**
   * Hash value with random salt
   * @return {string} string value hash followed by salt
   *  XXXX till 64 XXXX till 32
   */
  hashValue = (value: string): string => {
    // Any random string here (ideally should be at least 16 bytes)
    const salt = randomBytes(16).toString('hex');
    return this.encryptValue(value, salt) + salt;
  };

  matchValue = (value: string, hashedValue: string): boolean => {
    // extract salt from the hashed string
    // our hex password length is 32*2 = 64
    const salt = hashedValue.slice(64);
    const originalValueHash = hashedValue.slice(0, 64);
    const currentValueHash = this.encryptValue(value, salt);

    return timingSafeEqual(
      Buffer.from(originalValueHash),
      Buffer.from(currentValueHash),
    );
  };

  generateNumericalCode(codeLength = 6): number {
    const minMax = {
      '4': {
        min: 1000,
        max: 9999,
      },
      '6': {
        min: 100000,
        max: 999999,
      },
    };

    const minMaxKey =
      typeof minMax[codeLength] === 'undefined' ? '4' : codeLength;

    const options = {
      min: minMax[minMaxKey].min,
      max: minMax[minMaxKey].max,
      integer: true,
    };

    return randomNumber(options);
  }

  isDevelopmentEnv() {
    return this.configService.get('env') === DEVELOPMENT_ENV;
  }

  isStagingEnv() {
    return this.configService.get('env') === STAGING_ENV;
  }

  isTestEnv() {
    return this.configService.get('env') === TEST_ENV;
  }

  isProductionEnv() {
    return this.configService.get('env') === PRODUCTION_ENV;
  }

  getTime({
    plusAmount = 0,
    minusAmount = 0,
    formatted = true,
  }: GetTimeParams = {}) {
    const time = moment()
      .add(plusAmount, 'minutes')
      .subtract(minusAmount, 'minutes');

    return formatted ? time.toISOString() : time.unix();
  }

  isAfterDate({
    sourceDate = moment(),
    comparedDate,
  }: {
    sourceDate?: moment.Moment | string;
    comparedDate: moment.Moment | string;
  }) {
    return moment(sourceDate).isAfter(comparedDate);
  }

  t(key: string): string {
    return this.i18nService.t(key, { lang: I18nContext.current().lang });
  }
}
