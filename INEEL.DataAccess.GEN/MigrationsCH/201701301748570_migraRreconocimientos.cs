namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migraRreconocimientos : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CH.tab_LogrosReconocimientos",
                c => new
                    {
                        LogrosReconocimientosId = c.Int(nullable: false, identity: true),
                        ClavePersona = c.String(),
                        FechaValidacion = c.DateTime(),
                        EstadoFlujoId = c.Int(nullable: false),
                        AdjuntoId = c.Long(),
                        Titulo = c.String(),
                        Emisor = c.String(),
                        FechaObtencion = c.DateTime(nullable: false),
                        Descripcion = c.String(),
                    })
                .PrimaryKey(t => t.LogrosReconocimientosId)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId)
                .ForeignKey("GEN.cat_EstadoFlujo", t => t.EstadoFlujoId, cascadeDelete: true)
                .Index(t => t.EstadoFlujoId)
                .Index(t => t.AdjuntoId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CH.tab_LogrosReconocimientos", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("CH.tab_LogrosReconocimientos", "AdjuntoId", "GEN.Adjunto");
            DropIndex("CH.tab_LogrosReconocimientos", new[] { "AdjuntoId" });
            DropIndex("CH.tab_LogrosReconocimientos", new[] { "EstadoFlujoId" });
            DropTable("CH.tab_LogrosReconocimientos");
        }
    }
}
