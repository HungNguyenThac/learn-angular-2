import { ApiHttpInterceptor } from './api-http.interceptor';
import { TimingInterceptor } from './timing.interceptor';

export const interceptors: any [] = [ApiHttpInterceptor, TimingInterceptor];

export * from './api-http.interceptor';
export * from './timing.interceptor';
