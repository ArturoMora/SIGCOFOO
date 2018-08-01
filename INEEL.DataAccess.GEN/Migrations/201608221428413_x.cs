namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class x : DbMigration
    {
        public override void Up()
        {
            RenameColumn("GEN.Proyectos", "Gerencia", "UnidadOrganizacionalId");
            AlterColumn("GEN.Proyectos", "UnidadOrganizacionalId", c => c.String(nullable: false, maxLength: 10));
        }
        
        public override void Down()
        {
            RenameColumn("GEN.Proyectos", "UnidadOrganizacionalId", "Gerencia");
            //AlterColumn("GEN.Proyectos", "UnidadOrganizacionalId", c => c.String(maxLength: 10));
        }
    }
}
