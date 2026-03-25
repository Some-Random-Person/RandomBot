namespace RandomBot.Domain.Entities;

public class Setting
{
    public Guid Id {get; set;}
    public string Name {get; set;} = "";
    public DateTime CreatedAt {get; set;}
    public DateTime UpdatedAt {get; set;}
    public List<Guild> Guilds {get; set;} = [];
}