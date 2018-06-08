namespace WebApplication2.Models
{
    public class StatusItem
    {
        public long Id { get; set; }
        public bool IsLoading { get; set; }
        public bool IsComplete { get; set; }
        public bool IsPending { get; set; }
    }
}
