using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoList.Models
{
    public class TodoItemList: List<TodoItemModel>
    {
        int GetIndexTaskById(string id)
        {
            for (int i = 0; i < this.Count; i++)
                if (this[i].Id == id)
                    return i;
            return -1;
        }

        public void Push(string text)
        {
            TodoItemModel tm = new TodoItemModel();
            tm.Text = text;
            tm.Done = false;
            tm.Id = Guid.NewGuid().ToString();

            this.Add(tm);
        }

        public void Delete(string id)
        {
            int index = GetIndexTaskById(id);
            if(index != -1)
                this.Remove(this[index]);
            else
                throw new Exception("Todo not found");
        }

        public void Edit(string id, string text, bool done)
        {
            int index = GetIndexTaskById(id);
            if (index != -1)
            {
                this[index].Text = text;
                this[index].Done = done;
            }
            else
                throw new Exception("Todo not found");
        }
    }
}
