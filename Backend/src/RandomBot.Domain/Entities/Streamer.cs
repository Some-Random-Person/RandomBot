using System.ComponentModel.DataAnnotations;

namespace RandomBot.Domain.Entities;

public class Streamer
{
    public Guid Id {get; set;}
    public string Name {get; set;} = "";
    public bool IsLive {get; set;}
    [MaxLength(20)]
    public string ChannelId {get; set;} = "";
    public DateTime LastChecked {get; set;}
    public DateTime CreatedAt {get; set;}
    public DateTime UpdatedAt {get; set;}
    [MaxLength(20)]
    public string GuildId {get; set;} = "";
    public Guild Guild {get; set;} = null!;
}