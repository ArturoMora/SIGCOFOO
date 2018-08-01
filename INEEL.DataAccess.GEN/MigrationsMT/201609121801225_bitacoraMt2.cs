namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class bitacoraMt2 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("MT.BitacoraITFConsulta", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal");
            DropIndex("MT.BitacoraITFConsulta", new[] { "InformeTecnicoFinalId" });
            DropTable("MT.BitacoraITFConsulta");
        }
        
        public override void Down()
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
                .PrimaryKey(t => t.BitacoraITFDescargaId);
            
            CreateIndex("MT.BitacoraITFConsulta", "InformeTecnicoFinalId");
            AddForeignKey("MT.BitacoraITFConsulta", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal", "InformeTecnicoFinalId", cascadeDelete: true);
        }
    }
}
