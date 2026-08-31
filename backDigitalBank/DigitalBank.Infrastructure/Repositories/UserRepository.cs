using DigitalBank.Application.Interfaces;
using DigitalBank.Domain.Models;
using DigitalBank.Infrastructure.Entities;
using DigitalBank.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DigitalBank.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == id, cancellationToken);

        return entity is null ? null : ToDomain(entity);
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);

        return entity is null ? null : ToDomain(entity);
    }

    public async Task<User?> GetByUserNameAsync(string userName, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.UserName == userName, cancellationToken);

        return entity is null ? null : ToDomain(entity);
    }

    public async Task<User> AddAsync(User user, CancellationToken cancellationToken = default)
    {
        var entity = ToEntity(user);

        await _context.Users.AddAsync(entity, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return ToDomain(entity);
    }

    public async Task UpdateAsync(User user, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Users.FirstOrDefaultAsync(u => u.Id == user.Id, cancellationToken)
            ?? throw new InvalidOperationException($"User with id {user.Id} was not found.");

        entity.UserName = user.UserName;
        entity.UserFirstName = user.UserFirstName;
        entity.UserLastName = user.UserLastName;
        entity.Password = user.Password;
        entity.Email = user.Email;
        entity.PhoneNumber = user.PhoneNumber;

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
        if (entity is null)
            return;

        _context.Users.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }

    private static User ToDomain(UserEntity entity)
    {
        var (user, error) = User.Create(
            entity.Id, entity.UserName, entity.UserFirstName, entity.UserLastName,
            entity.Password, entity.Email, entity.PhoneNumber);

        return user ?? throw new InvalidOperationException($"Corrupted user data in database (id={entity.Id}): {error}");
    }

    private static UserEntity ToEntity(User user) => new()
    {
        Id = user.Id,
        UserName = user.UserName,
        UserFirstName = user.UserFirstName,
        UserLastName = user.UserLastName,
        Password = user.Password,
        Email = user.Email,
        PhoneNumber = user.PhoneNumber
    };
}
