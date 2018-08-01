namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class SolicitudesAcceso : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.tab_BitacoraSolicitudesAcceso", "RolAutorizador", c => c.Int(nullable: false));
            AddColumn("GEN.tab_BitacoraSolicitudesAcceso", "UnidadOrganizacionalId", c => c.String());
            DropColumn("GEN.tab_BitacoraSolicitudesAcceso", "idRol");
        }
        
        public override void Down()
        {
            AddColumn("GEN.tab_BitacoraSolicitudesAcceso", "idRol", c => c.Int(nullable: false));
            DropColumn("GEN.tab_BitacoraSolicitudesAcceso", "UnidadOrganizacionalId");
            DropColumn("GEN.tab_BitacoraSolicitudesAcceso", "RolAutorizador");
        }
    }
}
