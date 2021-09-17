import {RouterEffects} from './router.effect';
import {LoginEffects} from './login.effect';
import {CustomerEffects} from './customer.effect';
import {GeneralEffects} from "./general.effect";

export const effects: any[] = [RouterEffects, LoginEffects, CustomerEffects, GeneralEffects];

export * from './router.effect';
export * from './login.effect';
export * from './customer.effect';
export * from './general.effect';
