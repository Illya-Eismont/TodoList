using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoList.Models
{
    public class DataBase
    {
        public List<TodoItemList> Db = new List<TodoItemList>();
        MongoClient Client;
        IMongoDatabase database;
        IMongoCollection<User> Users;

        public DataBase()
        {
            Client = new MongoClient("mongodb+srv://neymon:0985414894@cluster0.n7ypu.mongodb.net/test?retryWrites=true&w=majority");
            database = Client.GetDatabase("test");
            Users = database.GetCollection<User>("Users");     
        }

        public async Task<User> GetUser(string id)
        {
            return await Users.Find(new BsonDocument("_id", new ObjectId(id))).FirstOrDefaultAsync();
        }

        public async Task AddUser(User user)
        {
            await Users.InsertOneAsync(user);
        }

        public async Task<User> UpdateUser(User user)
        {
            await Users.ReplaceOneAsync(new BsonDocument("_id", new ObjectId(user.Id)), user);
            return await Users.Find(new BsonDocument("_id", new ObjectId(user.Id))).FirstOrDefaultAsync();
        }

        public async Task RemoveUser(string id)
        {
            await Users.DeleteOneAsync(new BsonDocument("_id", new ObjectId(id)));
        }

    }
}
