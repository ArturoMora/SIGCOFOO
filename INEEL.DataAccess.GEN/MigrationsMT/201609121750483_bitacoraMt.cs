namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class bitacoraMt : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "MT.BitacoraITFConsulta",
                c => new
                    {
                        BitacoraITFDescargaId = c.Long(nullable: false, identity: true),
                        FechaMovimiento = c.DateTime(nullable: false),
                        ClavePersona = c.String(),
                        Ip = c.String(),
                        InformeTecnicoFinalId = c.String(nullable: false, maxLength: 10),
                    })
                .PrimaryKey(t => t.BitacoraITFDescargaId)
                .ForeignKey("MT.InformeTecnicoFinal", t => t.InformeTecnicoFinalId, cascadeDelete: true)
                .Index(t => t.InformeTecnicoFinalId);
            
            CreateTable(
                "MT.BitacoraITFDescarga",
                c => new
                    {
                        BitacoraITFDescargaId = c.Long(nullable: false, identity: true),
                        FechaMovimiento = c.DateTime(nullable: false),
                        ClavePersona = c.String(),
                        Ip = c.String(),
                        InformeTecnicoFinalId = c.String(nullable: false, maxLength: 10),
                    })
                .PrimaryKey(t => t.BitacoraITFDescargaId)
                .ForeignKey("MT.InformeTecnicoFinal", t => t.InformeTecnicoFinalId, cascadeDelete: true)
                .Index(t => t.InformeTecnicoFinalId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("MT.BitacoraITFDescarga", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal");
            DropForeignKey("MT.BitacoraITFConsulta", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal");
            DropIndex("MT.BitacoraITFDescarga", new[] { "InformeTecnicoFinalId" });
            DropIndex("MT.BitacoraITFConsulta", new[] { "InformeTecnicoFinalId" });
            DropTable("MT.BitacoraITFDescarga");
            DropTable("MT.BitacoraITFConsulta");
        }
    }
}
