using domain.person;
using Xunit;

namespace test_domain;

public class PersonTests
{
    [Fact]
    public void Create_ValidInputs_Succeeds()
    {
        var p = Person.Create("nm_test_create", "Alice", 1980, null);
        Assert.Equal("nm_test_create", p.LegacyId);
        Assert.Equal("Alice", p.PrimaryName);
        Assert.Equal(1980, p.BirthYear);
        Assert.Null(p.DeathYear);
    }

    [Fact]
    public void ChangePrimaryName_UpdatesName_AndNoopsOnSame()
    {
        var p = Person.Create("nm_change", "Alice", null, null);
        p.ChangePrimaryName("Bob");
        Assert.Equal("Bob", p.PrimaryName);

        p.ChangePrimaryName("Bob");
        Assert.Equal("Bob", p.PrimaryName);
    }

    [Fact]
    public void Create_InvalidInputs_Throws()
    {
        Assert.Throws<InvalidLegacyIdException>(() => Person.Create(" ", "Name", null, null));
        Assert.Throws<InvalidPrimaryNameException>(() => Person.Create("nm_x", " ", null, null));
    }
}


