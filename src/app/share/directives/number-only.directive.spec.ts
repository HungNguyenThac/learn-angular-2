import { NumberOnlyDirective } from './number-only.directive';

describe('NumberOnlyDirective', () => {
  it('should create an instance', () => {
    const directive = new NumberOnlyDirective(null, null);
    expect(directive).toBeTruthy();
  });
});
