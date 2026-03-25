using System.ComponentModel.DataAnnotations;

namespace RandomBot.Domain.Entities;

public class User
{
    [MaxLength(20)]
    public string Id {get; set;} = "";
    public DateTime CreatedAt {get; set;}
    public DateTime UpdatedAt {get; set;}
    public List<Reminder> Reminders {get; set;} = [];
}