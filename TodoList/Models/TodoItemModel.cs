using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoList.Models
{
    public class TodoItemModel
    {
        public string Text { get; set; }
        public string Id { get; set; }
        public bool Done { get; set; }
    }
}
