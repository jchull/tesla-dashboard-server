import { PersistenceService }  from './PersistenceService';

it('should initialize service', () => {
  const service = new PersistenceService(todo);
  expect(service).toBeDefined();
});
