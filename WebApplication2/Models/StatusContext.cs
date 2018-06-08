using Microsoft.EntityFrameworkCore;

namespace WebApplication2.Models
{
    public class StatusContext : DbContext
    {
        public StatusContext(DbContextOptions<StatusContext> options)
            : base(options)
        {
        }

        public DbSet<StatusItem> StatusItems { get; set; }

    }
}
