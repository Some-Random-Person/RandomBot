using System.ComponentModel.DataAnnotations;

namespace RandomBot.Domain.Entities;

public class Welcome
{
    public Guid Id {get; set;}
    public string Title {get; set;} = "";
    public string Message {get; set;} = "";
    [MaxLength(20)]
    public string ChannelId {get; set;} = "";
    public string ImageUrl {get; set;} = "";
    public string Color {get; set;} = "";
    public DateTime CreatedAt {get; set;}
    public DateTime UpdatedAt {get; set;}
    [MaxLength(20)]
    public string GuildId {get; set;} = "";
    public Guild Guild {get; set;} = null!;
}