namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class solicitudesCP : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CH.tab_SolicitudCP",
                c => new
                    {
                        SolicitudCPId = c.Int(nullable: false, identity: true),
                        ClavePersona = c.String(),
                        TipoInformacionId = c.Int(nullable: false),
                        InformacionId = c.Int(nullable: false),
                        FechaSolicitud = c.DateTime(nullable: false),
                        EstadoFlujoId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.SolicitudCPId)
                .ForeignKey("GEN.cat_EstadoFlujo", t => t.EstadoFlujoId, cascadeDelete: true)
                .ForeignKey("CH.cat_TipoInformacion", t => t.TipoInformacionId, cascadeDelete: true)
                .Index(t => t.TipoInformacionId)
                .Index(t => t.EstadoFlujoId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CH.tab_SolicitudCP", "TipoInformacionId", "CH.cat_TipoInformacion");
            DropForeignKey("CH.tab_SolicitudCP", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropIndex("CH.tab_SolicitudCP", new[] { "EstadoFlujoId" });
            DropIndex("CH.tab_SolicitudCP", new[] { "TipoInformacionId" });
            DropTable("CH.tab_SolicitudCP");
        }
    }
}
