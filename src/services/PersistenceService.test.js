import { PersistenceService } from './PersistenceService';

it('should checkToken service', () => {
  const service = new PersistenceService(todo);
  expect(service)
    .toBeDefined();
});
