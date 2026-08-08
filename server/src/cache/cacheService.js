const { redisClient } = require("../config/redis");

const getCache = async (key) => {
  try {
    if (!redisClient.isReady) {
      return null;
    }

    const data = await redisClient.get(key);

    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("❌ Cache GET error:", error.message);
    return null;
  }
};

const setCache = async (key, data, expiration = 300) => {
  try {
    if (!redisClient.isReady) {
      return;
    }

    await redisClient.setEx(
      key,
      expiration,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error("❌ Cache SET error:", error.message);
  }
};

const deleteCache = async (key) => {
  try {
    if (!redisClient.isReady) {
      return;
    }

    await redisClient.del(key);
  } catch (error) {
    console.error("❌ Cache DELETE error:", error.message);
  }
};

module.exports = {
  getCache,
  setCache,
  deleteCache,
};