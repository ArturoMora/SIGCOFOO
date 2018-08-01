namespace INEEL.DataAccess.GEN.MigrationsPI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HistorialPI : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "PI.tab_HistorialPI",
                c => new
                    {
                        HistorialPIId = c.Int(nullable: false, identity: true),
                        PropiedadIndustrialId = c.Int(nullable: false),
                        Accion = c.String(),
                        FechaAccion = c.DateTime(),
                        FechaRegistroAccion = c.DateTime(),
                        AdjuntoId = c.Long(),
                    })
                .PrimaryKey(t => t.HistorialPIId)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId)
                .ForeignKey("PI.tab_PropiedadIndustrial", t => t.PropiedadIndustrialId, cascadeDelete: true)
                .Index(t => t.PropiedadIndustrialId)
                .Index(t => t.AdjuntoId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("PI.tab_HistorialPI", "PropiedadIndustrialId", "PI.tab_PropiedadIndustrial");
            DropForeignKey("PI.tab_HistorialPI", "AdjuntoId", "GEN.Adjunto");
            DropIndex("PI.tab_HistorialPI", new[] { "AdjuntoId" });
            DropIndex("PI.tab_HistorialPI", new[] { "PropiedadIndustrialId" });
            DropTable("PI.tab_HistorialPI");
        }
    }
}
