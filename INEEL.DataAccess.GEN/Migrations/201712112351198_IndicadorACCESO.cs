namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class IndicadorACCESO : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GEN.tab_acceso_modulos",
                c => new
                    {
                        id = c.Long(nullable: false, identity: true),
                        claveEmpleado = c.String(maxLength: 5),
                        fecha = c.String(maxLength: 10),
                        modulo = c.String(maxLength: 10),
                        ocID = c.String(maxLength: 20),
                    })
                .PrimaryKey(t => t.id);
            
            CreateTable(
                "GEN.tab_acceso_modulos_oc",
                c => new
                    {
                        id = c.Long(nullable: false, identity: true),
                        claveEmpleado = c.String(maxLength: 5),
                        fecha = c.String(maxLength: 10),
                        modulo = c.String(),
                    })
                .PrimaryKey(t => t.id);
            
        }
        
        public override void Down()
        {
            DropTable("GEN.tab_acceso_modulos_oc");
            DropTable("GEN.tab_acceso_modulos");
        }
    }
}
