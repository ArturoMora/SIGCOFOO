namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migPeriodoRecepcion : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GI.tab_PeriodoRecepcion",
                c => new
                    {
                        PeriodoRecepcionId = c.Int(nullable: false, identity: true),
                        PeriodoFIId = c.Int(nullable: false),
                        FechaInicioPlaneada = c.DateTime(nullable: false),
                        FechaInicioReal = c.DateTime(nullable: false),
                        FechaTerminoPlaneada = c.DateTime(nullable: false),
                        FechaTerminoReal = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.PeriodoRecepcionId)
                .ForeignKey("GI.tab_PeriodoFI", t => t.PeriodoFIId, cascadeDelete: true)
                .Index(t => t.PeriodoFIId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_PeriodoRecepcion", "PeriodoFIId", "GI.tab_PeriodoFI");
            DropIndex("GI.tab_PeriodoRecepcion", new[] { "PeriodoFIId" });
            DropTable("GI.tab_PeriodoRecepcion");
        }
    }
}
