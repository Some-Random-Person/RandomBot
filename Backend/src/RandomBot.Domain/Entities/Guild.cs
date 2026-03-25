using System.ComponentModel.DataAnnotations;

namespace RandomBot.Domain.Entities;

public class Guild
{
    [MaxLength(20)]
    public string Id {get; set;} = "";
    public DateTime CreatedAt {get; set;}
    public DateTime UpdatedAt {get; set;}
    public List<Setting> Settings {get; set;} = [];
    public List<Welcome> Welcomes {get; set;} = [];
    public List<Streamer> Streamers {get; set;} = [];
}