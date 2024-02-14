import { expect, use, should } from 'chai';
import chaiHttp from 'chai-http';
import { promisify } from 'util';
import dbClient from '../utils/db';

use(chaiHttp);
should();

describe('Database Client Tests', () => {

  before(async () => {
    await dbClient.usersCollection.deleteMany({});
    await dbClient.filesCollection.deleteMany({});
  });

  after(async () => {
    await dbClient.usersCollection.deleteMany({});
    await dbClient.filesCollection.deleteMany({});
  });

  it('should connect to the database', async () => {
    await connectDB();

    expect(mongoose.connect).toHaveBeenCalled();
  });

  it('should disconnect from the database', async () => {
    await disconnectDB();

    expect(mongoose.disconnect).toHaveBeenCalled();
  });

  it('shows that the connection is alive', () => {
    expect(dbClient.isAlive().to.equal(true));
  });

  it('shows number of user documents', () => {
    await dbClient.usersCollection.deleteMany({});
    expect(await dbClient.nbUsers()).to.equal(0);

    await dbClient.usersCollection.insertOne({ name: 'Joel' });
    await dbClient.usersCollection.insertOne({ name: 'Cynthia' });
    expect(await dbClient.nbUsers()).to.equal(2);
  });

  it('shows number of files', () => {
    await dbClient.usersCollection.deleteMany({});
    expect(await dbClient.nbUsers()).to.equal(0);

    await dbClient.filesCollection.insertOne({ name: 'File1' });
    await dbClient.filesCollection.insertOne({ name: 'File2' });
    expect(await dbClient.nbUsers()).to.equal(2);
  });
});
