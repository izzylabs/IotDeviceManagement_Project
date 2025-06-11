import {delCache, getCache, setCache} from "./cache";

describe('In-memory Cache Service', () => {
    const testKey = 'test:key';
    const testValue = { name: 'Test Device', isActive: true };

    afterEach(() => {
        delCache(testKey);
    });

    it('should store and retrieve a cached value', () => {
        setCache(testKey, testValue);

        const cached = getCache<typeof testValue>(testKey);
        expect(cached).toEqual(testValue);
    });

    it('should return undefined after deleting a cached value', () => {
        setCache(testKey, testValue);
        delCache(testKey);

        const cached = getCache<typeof testValue>(testKey);
        expect(cached).toBeUndefined();
    });

    it('should return undefined for missing keys', () => {
        const cached = getCache(testKey);
        expect(cached).toBeUndefined();
    });
});