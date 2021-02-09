using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoList.Models
{
    public class User
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public TodoItemList TodoItems { get; set; }

        public User(string id, TodoItemList tasks)
        {
            Id = id;
            TodoItems = tasks;
        }

        public User(string id)
        {
            Id = id;
            TodoItems = new TodoItemList();
        }
    }
}
