using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using WebApplication2.Models;

namespace WebApplication2.Controllers
{
    [Route("api/[controller]")]
    public class StatusController : Controller
    {
        private readonly StatusContext _context;

        public StatusController(StatusContext context)
        {
            _context = context;

            if (_context.StatusItems.Count() == 0)
            {
                _context.StatusItems.Add(new StatusItem { IsLoading = false, IsComplete = false, IsPending = false });
                _context.SaveChanges();
            }
        }

        [HttpGet]
        public IEnumerable<StatusItem> GetAll()
        {
            return _context.StatusItems.ToList();
        }

        [HttpGet("{id}", Name = "GetStatus")]
        public IActionResult GetById(long id)
        {
            var item = _context.StatusItems.FirstOrDefault(t => t.Id == id);
            if (item == null)
            {
                return NotFound();
            }
            return new ObjectResult(item);
        }

        [HttpPost]
        public IActionResult Create([FromBody] StatusItem item)
        {
            if (item == null)
            {
                return BadRequest();
            }

            _context.StatusItems.Add(item);
            _context.SaveChanges();

            return CreatedAtRoute("GetStatus", new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public IActionResult Update(long id, [FromBody] StatusItem item)
        {
            if (item == null || item.Id != id)
            {
                return BadRequest();
            }

            var status = _context.StatusItems.FirstOrDefault(t => t.Id == id);
            if (status == null)
            {
                return NotFound();
            }

            status.IsLoading = item.IsLoading;
            status.IsComplete = item.IsComplete;
            status.IsPending = item.IsPending;

            _context.StatusItems.Update(status);
            _context.SaveChanges();
            return new NoContentResult();
        }
    }
}
