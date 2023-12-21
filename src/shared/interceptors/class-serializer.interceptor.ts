import { ClassSerializerInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomClassSerializerInterceptor extends ClassSerializerInterceptor {
  serialize(response: any, options: any) {
    // Add custom serialization logic if needed
    return super.serialize(response, options);
  }
}
