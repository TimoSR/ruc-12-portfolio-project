using System.Collections.ObjectModel;

namespace service_patterns;

public interface IEntity;

public abstract class Entity : IEntity;

public interface IAggregateRoot : IEntity
{
    /// <summary>
    /// Gets the read-only collection of domain events raised by this aggregate.
    /// </summary>
    public ReadOnlyCollection<DomainEvent> DomainEvents { get; }

    /// <summary>
    /// Adds a new domain event to the aggregate's event queue.
    /// </summary>
    /// <param name="domainEvent">The domain event to record.</param>
    void AddDomainEvent(DomainEvent domainEvent);

    /// <summary>
    /// Clears all domain events from the aggregate.
    /// Typically called after events have been dispatched.
    /// </summary>
    void ClearDomainEvents();
}

public abstract class AggregateRoot : Entity, IAggregateRoot
{
    private readonly List<DomainEvent> _domainEvents = [];
    public ReadOnlyCollection<DomainEvent> DomainEvents => _domainEvents.AsReadOnly();

    public void AddDomainEvent(DomainEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }

    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }
}; 

public interface IRepository<T> where T : IAggregateRoot;

public abstract class ValueObject;

public abstract record DomainEvent
{
    public Guid Id { get; } = Guid.NewGuid();
    public DateTime OccurredAt { get; } = DateTime.UtcNow;
}

public class DomainException : Exception
{
    public DomainException(string message) : base(message) { }

    public DomainException(string message, Exception? inner) : base(message, inner) { }
}