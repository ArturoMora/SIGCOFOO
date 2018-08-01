namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class bitacoraMt3 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "MT.BitacoraITFConsulta",
                c => new
                    {
                        BitacoraITFConsultaId = c.Long(nullable: false, identity: true),
                        FechaMovimiento = c.DateTime(nullable: false),
                        ClavePersona = c.String(),
                        Ip = c.String(),
                        InformeTecnicoFinalId = c.String(nullable: false, maxLength: 10),
                    })
                .PrimaryKey(t => t.BitacoraITFConsultaId)
                .ForeignKey("MT.InformeTecnicoFinal", t => t.InformeTecnicoFinalId, cascadeDelete: true)
                .Index(t => t.InformeTecnicoFinalId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("MT.BitacoraITFConsulta", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal");
            DropIndex("MT.BitacoraITFConsulta", new[] { "InformeTecnicoFinalId" });
            DropTable("MT.BitacoraITFConsulta");
        }
    }
}
