namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migFI : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GI.tab_PeriodoFI",
                c => new
                    {
                        PeriodoFIId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(nullable: false, maxLength: 150),
                        Descripcion = c.String(),
                        FechaInicioPlaneada = c.DateTime(nullable: false),
                        FechaInicioReal = c.DateTime(nullable: false),
                        FechaTerminoPlaneada = c.DateTime(nullable: false),
                        FechaTerminoReal = c.DateTime(nullable: false),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.PeriodoFIId)
                .Index(t => t.Nombre, unique: true);
            
        }
        
        public override void Down()
        {
            DropIndex("GI.tab_PeriodoFI", new[] { "Nombre" });
            DropTable("GI.tab_PeriodoFI");
        }
    }
}
