namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ModificacionCapitulo : DbMigration
    {
        public override void Up()
        {
            AddColumn("MT.AutorInternoCapitulo", "NombreCompleto", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("MT.AutorInternoCapitulo", "NombreCompleto");
        }
    }
}
