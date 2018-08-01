namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class itfAutores2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("MT.AutorITF", "ClaveAutor", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("MT.AutorITF", "ClaveAutor");
        }
    }
}
