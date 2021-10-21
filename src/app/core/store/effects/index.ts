import {RouterEffects} from './router.effect';
import {LoginEffects} from './login.effect';
import {CustomerEffects} from './customer.effect';

export const effects: any[] = [RouterEffects, LoginEffects, CustomerEffects];

export * from './router.effect';
export * from './login.effect';
export * from './customer.effect';
