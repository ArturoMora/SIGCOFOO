namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class BitacoraOportunidadNegocio : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CR.tBitacoraON",
                c => new
                    {
                        BitacoraOportunidadNegocioId = c.Int(nullable: false, identity: true),
                        OportunidadNegocioId = c.Int(nullable: false),
                        ComentarioPersona = c.String(maxLength: 500),
                        ComentarioSistema = c.String(maxLength: 500),
                        EstadoFlujoId = c.Int(nullable: false),
                        GerenciaId = c.Int(nullable: false),
                        InvestigadorId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.BitacoraOportunidadNegocioId);
            
        }
        
        public override void Down()
        {
            DropTable("CR.tBitacoraON");
        }
    }
}
