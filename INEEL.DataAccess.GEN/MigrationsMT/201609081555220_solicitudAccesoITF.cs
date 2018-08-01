namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class solicitudAccesoITF : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "MT.SolicitudAccesoITF",
                c => new
                    {
                        SolicitudAccesoITFId = c.Int(nullable: false, identity: true),
                        InformeTecnicoFinalId = c.String(maxLength: 10),
                        ClavePersonaSolicitante = c.String(nullable: false, maxLength: 10),
                        ClaveUnidadDelSolicitante = c.String(maxLength: 10),
                        EstadoFlujoId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.SolicitudAccesoITFId)
                .ForeignKey("GEN.cat_EstadoFlujo", t => t.EstadoFlujoId, cascadeDelete: true)
                .ForeignKey("MT.InformeTecnicoFinal", t => t.InformeTecnicoFinalId)
                .Index(t => t.InformeTecnicoFinalId)
                .Index(t => t.EstadoFlujoId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("MT.SolicitudAccesoITF", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal");
            DropForeignKey("MT.SolicitudAccesoITF", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropIndex("MT.SolicitudAccesoITF", new[] { "EstadoFlujoId" });
            DropIndex("MT.SolicitudAccesoITF", new[] { "InformeTecnicoFinalId" });
            DropTable("MT.SolicitudAccesoITF");
        }
    }
}
