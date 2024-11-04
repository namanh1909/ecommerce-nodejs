import Redis from 'ioredis';
import config from '../../config/config';

const redisClient = new Redis(config.redisConfig);
console.log(config.redisConfig);
redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Redis error', err);
});

export default redisClient;
