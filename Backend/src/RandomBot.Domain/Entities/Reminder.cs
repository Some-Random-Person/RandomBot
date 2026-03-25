using System.ComponentModel.DataAnnotations;

namespace RandomBot.Domain.Entities;

public class Reminder
{
    public Guid Id {get; set;}
    public DateTime CreatedAt {get; set;}
    public DateTime UpdatedAt {get; set;}
    [MaxLength(20)]
    public string UserId {get; set;} = "";
    public User User {get; set;} = null!;
}