namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migraCapycertif : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CH.tab_CapacitacionYcertificacion",
                c => new
                    {
                        CapacitacionYcertificacionId = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(),
                        FechaObtencion = c.DateTime(nullable: false),
                        EstadoFlujoId = c.Int(nullable: false),
                        AdjuntoId = c.Long(),
                    })
                .PrimaryKey(t => t.CapacitacionYcertificacionId)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId)
                .ForeignKey("GEN.cat_EstadoFlujo", t => t.EstadoFlujoId, cascadeDelete: true)
                .Index(t => t.EstadoFlujoId)
                .Index(t => t.AdjuntoId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CH.tab_CapacitacionYcertificacion", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("CH.tab_CapacitacionYcertificacion", "AdjuntoId", "GEN.Adjunto");
            DropIndex("CH.tab_CapacitacionYcertificacion", new[] { "AdjuntoId" });
            DropIndex("CH.tab_CapacitacionYcertificacion", new[] { "EstadoFlujoId" });
            DropTable("CH.tab_CapacitacionYcertificacion");
        }
    }
}
