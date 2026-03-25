using System.ComponentModel.DataAnnotations;

namespace RandomBot.Domain.Entities;

public class GuildSetting
{
    [MaxLength(20)]
    public string GuildsId {get; set;} = "";
    public Guid SettingsId {get; set;}
    public bool Value {get; set;} = false;
    public DateTime CreatedAt {get; set;}
    public DateTime UpdatedAt {get; set;}
}