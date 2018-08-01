namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migPeriodoReplica : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GI.tab_PeriodoReplica",
                c => new
                    {
                        PeriodoReplicaId = c.Int(nullable: false, identity: true),
                        PeriodoFIId = c.Int(nullable: false),
                        FechaInicioPlaneada = c.DateTime(nullable: false),
                        FechaInicioReal = c.DateTime(nullable: false),
                        FechaTerminoPlaneada = c.DateTime(nullable: false),
                        FechaTerminoReal = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.PeriodoReplicaId)
                .ForeignKey("GI.tab_PeriodoFI", t => t.PeriodoFIId, cascadeDelete: true)
                .Index(t => t.PeriodoFIId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_PeriodoReplica", "PeriodoFIId", "GI.tab_PeriodoFI");
            DropIndex("GI.tab_PeriodoReplica", new[] { "PeriodoFIId" });
            DropTable("GI.tab_PeriodoReplica");
        }
    }
}
